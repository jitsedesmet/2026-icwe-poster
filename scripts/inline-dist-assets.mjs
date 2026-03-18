import fs from 'node:fs/promises'
import path from 'node:path'

const [, , htmlFileArg] = process.argv

if (!htmlFileArg) {
    console.error('Usage: node ./scripts/inline-dist-assets.mjs <path-to-index.html>')
    process.exit(1)
}

const htmlFilePath = path.resolve(process.cwd(), htmlFileArg)
const htmlDir = path.dirname(htmlFilePath)

const isExternalUrl = (value) => /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith('data:')

const rewriteCssRelativeUrls = (cssText, cssHref) => {
    const cssDir = path.posix.dirname(cssHref)

    return cssText.replace(/url\(([^)]+)\)/g, (fullMatch, rawValue) => {
        const trimmed = rawValue.trim()
        const hasSingleQuote = trimmed.startsWith("'") && trimmed.endsWith("'")
        const hasDoubleQuote = trimmed.startsWith('"') && trimmed.endsWith('"')
        const quote = hasSingleQuote ? "'" : hasDoubleQuote ? '"' : ''
        const urlValue = quote ? trimmed.slice(1, -1) : trimmed

        if (
            !urlValue ||
            urlValue.startsWith('#') ||
            urlValue.startsWith('/') ||
            urlValue.startsWith('file:') ||
            isExternalUrl(urlValue)
        ) {
            return fullMatch
        }

        const hashIndex = urlValue.indexOf('#')
        const queryIndex = urlValue.indexOf('?')
        const suffixIndex =
            hashIndex === -1 ? queryIndex : queryIndex === -1 ? hashIndex : Math.min(hashIndex, queryIndex)
        const pathname = suffixIndex === -1 ? urlValue : urlValue.slice(0, suffixIndex)
        const suffix = suffixIndex === -1 ? '' : urlValue.slice(suffixIndex)

        const rebasedPath = path.posix.normalize(path.posix.join(cssDir, pathname))
        return `url(${quote}${rebasedPath}${suffix}${quote})`
    })
}

const readTextFileFromHref = async (href) => {
    const filePath = path.resolve(htmlDir, href)
    return fs.readFile(filePath, 'utf8')
}

const inlineStylesheets = async (html) => {
    const stylesheetRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi
    const matches = [...html.matchAll(stylesheetRegex)]
    if (matches.length === 0) return html

    let nextHtml = html
    for (const match of matches) {
        const [tag, href] = match
        if (isExternalUrl(href)) continue

        const cssText = await readTextFileFromHref(href)
        const rebasedCssText = rewriteCssRelativeUrls(cssText, href)
        const styleTag = `<style>\n${rebasedCssText}\n</style>`
        nextHtml = nextHtml.replace(tag, styleTag)
    }

    return nextHtml
}

const inlineModuleScripts = async (html) => {
    const moduleScriptRegex = /<script\s+[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/gi
    const matches = [...html.matchAll(moduleScriptRegex)]
    if (matches.length === 0) return html

    let nextHtml = html
    for (const match of matches) {
        const [tag, src] = match
        if (isExternalUrl(src)) continue

        const jsText = await readTextFileFromHref(src)
        const scriptTag = `<script type="module">\n${jsText}\n</script>`
        nextHtml = nextHtml.replace(tag, scriptTag)
    }

    return nextHtml
}

const run = async () => {
    const originalHtml = await fs.readFile(htmlFilePath, 'utf8')
    let nextHtml = await inlineStylesheets(originalHtml)
    nextHtml = await inlineModuleScripts(nextHtml)
    await fs.writeFile(htmlFilePath, nextHtml, 'utf8')
    console.log(`Inlined JS/CSS into ${htmlFilePath}`)
}

run().catch((error) => {
    console.error(error)
    process.exit(1)
})


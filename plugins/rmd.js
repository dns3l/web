import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
// import rehypeHighlight from 'rehype-highlight'

export default ({ app }, inject) => {
  // Inject $renderMarkdown(str) in Vue, context and store.
  inject('renderMarkdown', (m) => {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      // .use(rehypeHighlight)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .processSync(m)
  })
}

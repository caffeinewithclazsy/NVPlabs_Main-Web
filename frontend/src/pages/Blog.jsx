import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { api } from "../lib/api";

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/blog").then(({ data }) => setPosts(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 grid-pattern" data-testid="blog-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Blog</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-3xl">Notes on craft & code.</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p, i) => (
                <motion.article key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass-card !p-0 overflow-hidden group" data-testid={`blog-card-${i}`}>
                  <Link to={`/blog/${p.slug}`}>
                    {p.cover_image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(p.tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] font-mono uppercase tracking-wider text-nvp-red border border-nvp-red/20 bg-nvp-red/5 rounded-full px-2 py-0.5">{t}</span>
                        ))}
                      </div>
                      <h3 className="font-display font-semibold text-lg tracking-tight">{p.title}</h3>
                      <p className="mt-2 text-sm text-foreground/60 leading-relaxed line-clamp-3">{p.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between text-xs text-foreground/50">
                        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" strokeWidth={2} />{new Date(p.created_at).toLocaleDateString()}</span>
                        <span className="inline-flex items-center gap-1 underline-link">Read <ArrowRight className="h-3 w-3" strokeWidth={2} /></span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    api.get(`/blog/${slug}`).then(({ data }) => setPost(data)).catch(() => setErr(true));
  }, [slug]);

  if (err) return (
    <div className="pt-44 pb-20 text-center">
      <h1 className="font-display font-bold text-3xl mb-4">Post not found</h1>
      <Link to="/blog"><LiquidButton variant="glass">Back to blog</LiquidButton></Link>
    </div>
  );
  if (!post) return <div className="pt-44 text-center text-foreground/50">Loading…</div>;

  return (
    <article className="overflow-x-hidden">
      <div className="pt-32 pb-12 md:pt-40 md:pb-16 max-w-3xl mx-auto px-5 md:px-8">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs underline-link text-foreground/70 mb-8" data-testid="blog-back"><ArrowLeft className="h-3 w-3" /> Back to blog</Link>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(post.tags || []).map((t) => (<span key={t} className="text-[10px] font-mono uppercase tracking-wider text-nvp-red border border-nvp-red/20 bg-nvp-red/5 rounded-full px-2 py-0.5">{t}</span>))}
        </div>
        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[1.05]">{post.title}</h1>
        <div className="mt-4 text-xs text-foreground/55 font-mono uppercase tracking-wider">
          {post.author} · {new Date(post.created_at).toLocaleDateString()}
        </div>
        {post.cover_image && (
          <div className="mt-8 aspect-[16/9] rounded-2xl overflow-hidden border border-foreground/10">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="mt-8 prose prose-sm md:prose-base max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">{post.content}</div>
      </div>
    </article>
  );
}

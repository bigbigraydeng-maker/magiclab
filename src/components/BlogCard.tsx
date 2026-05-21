import Link from 'next/link';

interface BlogCardProps {
  title: string;
  tag?: string;
  href?: string;
}

const BlogCardContent = ({ title, tag = 'Insight' }: Omit<BlogCardProps, 'href'>) => {
  return (
    <>
      <span className="text-xs font-bold text-mist uppercase tracking-[0.24em] mb-4">
        {tag}
      </span>
      <h3 className="text-xl font-extrabold leading-7 text-white mb-6 flex-1">{title}</h3>
      <span className="text-sm font-semibold text-silver flex items-center gap-1.5">
        Read more
      </span>
    </>
  );
};

const BlogCard = ({ title, tag = 'Insight', href }: BlogCardProps) => {
  const className = 'blog-card rounded-lg border border-silver/20 bg-white/[0.04] p-7 flex flex-col h-full';

  if (href) {
    return (
      <Link href={href} className={className}>
        <BlogCardContent title={title} tag={tag} />
      </Link>
    );
  }

  return (
    <div className={className}>
      <BlogCardContent title={title} tag={tag} />
    </div>
  );
};

export default BlogCard;

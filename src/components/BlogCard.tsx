interface BlogCardProps {
  title: string;
}

const BlogCard = ({ title }: BlogCardProps) => {
  return (
    <div className="blog-card bg-gray-800 p-8 rounded-xl">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    </div>
  );
};

export default BlogCard;
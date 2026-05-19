interface ServiceCardProps {
  icon: string;
  title: string;
  description: string[];
  accent?: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="service-card screen-card rounded-[24px] p-7">
      <div className="relative z-10 mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-aqua/20 bg-aqua/10 text-sm font-extrabold text-aqua">
        {icon}
      </div>
      <h3 className="relative z-10 text-2xl font-extrabold text-white mb-4">{title}</h3>
      <ul className="relative z-10 space-y-3">
        {description.map((item, index) => (
          <li key={index} className="text-mist flex items-start gap-2.5 text-sm leading-6">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;

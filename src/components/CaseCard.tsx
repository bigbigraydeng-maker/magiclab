interface CaseCardProps {
  client: string;
  description: string[];
}

const CaseCard = ({ client, description }: CaseCardProps) => {
  return (
    <div className="case-card bg-gray-800 p-8 rounded-xl">
      <h3 className="text-xl font-semibold text-white mb-4">{client}</h3>
      <ul className="space-y-2">
        {description.map((item, index) => (
          <li key={index} className="text-gray-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseCard;
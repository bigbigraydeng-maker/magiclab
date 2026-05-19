/* eslint-disable @next/next/no-img-element */

interface CaseCardProps {
  client: string;
  description: string[];
  image?: string;
}

const tagColors: Record<string, string> = {
  'AI': 'bg-white/[0.08] text-silver border-silver/20',
  'Web': 'bg-white/[0.08] text-silver border-silver/20',
  'Data': 'bg-white/[0.08] text-silver border-silver/20',
  'SEO': 'bg-white/[0.08] text-silver border-silver/20',
};

function getTag(desc: string): { label: string; color: string } {
  if (desc.toLowerCase().includes('ai') || desc.toLowerCase().includes('quantitative') || desc.toLowerCase().includes('sentiment'))
    return { label: 'AI', color: tagColors['AI'] };
  if (desc.toLowerCase().includes('data') || desc.toLowerCase().includes('scraping'))
    return { label: 'Data', color: tagColors['Data'] };
  if (desc.toLowerCase().includes('seo') || desc.toLowerCase().includes('conversion'))
    return { label: 'SEO', color: tagColors['SEO'] };
  return { label: 'Web', color: tagColors['Web'] };
}

const CaseCard = ({ client, description, image }: CaseCardProps) => {
  const tag = getTag(description.join(' '));

  return (
    <div className="case-card rounded-lg border border-silver/20 bg-white/[0.04] flex flex-col h-full overflow-hidden">
      {image ? (
        <div className="relative w-full h-44 overflow-hidden bg-secondary">
          <img
            src={image}
            alt={`${client} project screenshot`}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
        </div>
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <span className="text-4xl font-extrabold text-silver">{client.charAt(0)}</span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-white">{client}</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tag.color}`}>
            {tag.label}
          </span>
        </div>
        <ul className="space-y-2 flex-1">
          {description.map((item, index) => (
            <li key={index} className="text-mist flex items-start gap-2.5 text-sm leading-6">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-silver" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CaseCard;

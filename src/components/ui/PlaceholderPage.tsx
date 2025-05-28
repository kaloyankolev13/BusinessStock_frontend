interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="p-8 text-center text-gray-500">
      {title} coming soon...
    </div>
  );
};

export default PlaceholderPage; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MetricCard = ({ icon, bgColor, textColor, title, value }) => {
  return (
    <div className="bg-white p-7 rounded-xl shadow-lg flex items-center space-x-5 card-hover-effect">
      <div className={`p-4 ${bgColor} rounded-full ${textColor} shadow-inner`}>
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <p className={`text-4xl font-bold ${textColor} mt-1`}>{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;

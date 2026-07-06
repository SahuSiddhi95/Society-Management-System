const ActivityTable = () => {

  const data = [
    {
      type: "Complaint",
      description: "Water leakage in bathroom",
      resident: "Rahul K.",
      status: "Urgent",
      time: "10 min ago",
    },
    {
      type: "Payment",
      description: "Maintenance fee - May",
      resident: "Siddhi M.",
      status: "Paid",
      time: "1 hr ago",
    },
    {
      type: "Resident",
      description: "Moved into C-101",
      resident: "Priya V.",
      status: "New",
      time: "3 hrs ago",
    },
    {
      type: "Notice",
      description: "Water supply shutdown",
      resident: "Admin",
      status: "Active",
      time: "Yesterday",
    },
    {
      type: "Complaint",
      description: "Elevator not working",
      resident: "Vikram S.",
      status: "In Progress",
      time: "Yesterday",
    },
  ];

  const getStatusColor = (status) => {

    switch (status) {

      case "Urgent":
        return "bg-red-500/20 text-red-400";

      case "Paid":
        return "bg-green-500/20 text-green-400";

      case "New":
        return "bg-blue-500/20 text-blue-400";

      case "Active":
        return "bg-yellow-500/20 text-yellow-400";

      case "In Progress":
        return "bg-orange-500/20 text-orange-400";

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

 return (

  <div className="bg-[#171717] border border-gray-800 rounded-3xl p-5 shadow-xl w-full">

    {/* Header */}
    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-lg font-semibold text-white tracking-wide">
          Dashboard Activity
        </h2>

        <p className="text-gray-500 text-xs mt-1 tracking-wide">
          Recent updates from society
        </p>

      </div>

      <button className="text-blue-400 hover:text-blue-500 text-xs font-medium">
        View All →
      </button>

    </div>

    {/* Table */}
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-gray-800 text-gray-500 text-[11px] tracking-widest uppercase">

            <th className="text-left pb-4 font-medium">
              Type
            </th>

            <th className="text-left pb-4 font-medium">
              Description
            </th>

            <th className="text-left pb-4 font-medium">
              Resident
            </th>

            <th className="text-left pb-4 font-medium">
              Time
            </th>

            <th className="text-left pb-4 font-medium">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((item, index) => (

            <tr
              key={index}
              className="border-b border-gray-900 hover:bg-[#1f1f1f] transition"
            >

              <td className="py-4 text-sm text-white font-medium">
                {item.type}
              </td>

              <td className="text-[13px] text-gray-300 leading-5">
                {item.description}
              </td>

              <td className="text-[13px] text-gray-200">
                {item.resident}
              </td>

              <td className="text-xs text-gray-500">
                {item.time}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

);
};

export default ActivityTable;
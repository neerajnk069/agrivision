import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { axiosInstance } from "../Config";

const RevenueChart = () => {
  const [series, setSeries] = useState([{ data: [] }]);
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [],
      title: {
        text: "Time Period",
      },
    },
    yaxis: {
      title: {
        text: "Revenue ($)",
      },
      min: 0,
    },
    fill: {
      opacity: 1,
    },
    colors: ["#bb2d3b", "#6a0dad", "#00bcd4"],
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val.toLocaleString();
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  });

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  const fetchData = async (period) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/chart?period=${period}`);
      const { data, categories } = response.data;

      if (!Array.isArray(data) || !Array.isArray(categories)) return;

      if (data.length === 0 || data.every((item) => item === 0)) {
        setSeries([
          {
            name: "Revenue",
            data: [0],
          },
        ]);
        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: ["No Data Available"],
          },
        }));
      } else {
        setSeries([
          {
            name: "Revenue",
            data: data,
          },
        ]);
        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: categories || [],
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  return (
    <div className="col-12 mt-2">
      <div className="card card-statistics">
        <div className="card-header">
          <h4 className="card-title">Transaction Report</h4>
          <div className="d-flex justify-content-end">
            <select
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="all">All Data</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;

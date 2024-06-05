import { Bars } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div
      className="flex flex-col justify-center items-center w-full h-full"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Bars
        height="50"
        width="50"
        radius="9"
        color="rgb(149, 33, 52)"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />

      <p className="text-md mt-2 text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;

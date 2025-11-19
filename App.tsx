import React from "react";
import Homepage from "./src/components/Homepage";
import { LeaseTransfer } from "./src/screens/LeaseTransfer/LeaseTransfer";


export default function App() {
  return <LeaseTransfer />;
  // const handleGetStarted = () => {
  //   console.log("Get Started pressed");
  // };

  // return <Homepage onGetStarted={handleGetStarted} />;
}


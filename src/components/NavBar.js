import React from "react";

const NavBar = ({ web3Handler, account }) => {
  return (
    <nav className="flex-between">
      <h1>Testing App</h1>
      {account ? (
        <p>{account}</p>
      ) : (
        <button onClick={web3Handler}>Connect Wallet</button>
      )}
    </nav>
  );
};

export default NavBar;

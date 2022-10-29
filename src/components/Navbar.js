import React from "react";
import { Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import Wallet from "./Wallet";
import { useBalance } from "../hooks";

const Navbar = ({profile}) => {
  const { address, destroy, connect } = useContractKit();
  const { balance } = useBalance();
  return (
    <nav className="d-flex justify-content-end py-3">
      <div>
        {/*display user wallet*/}
        {address ? (
          <div className="nav_content">
            <Button
              variant="outline-dark"
              className="px-3"
              onClick={() => {
                profile({
                  status: true
                })
              }}
            >
              Profile
            </Button>

            <Button
              variant="outline-dark"
              className="px-3 mx-4"
              onClick={() => {
                profile({
                  status: false
                })
              }}
            >
              Marketplace
            </Button>
            <Wallet
              address={address}
              amount={balance.CELO}
              symbol="CELO"
              destroy={destroy}
            />
          </div>
        ) : (
          <Button
            onClick={() => connect().catch((e) => console.log(e))}
            variant="outline-dark"
            className="px-3"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
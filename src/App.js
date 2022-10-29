import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Navbar from "./components/Navbar";
import Profile from "./components/pages/Profile";
import Cover from "./components/pages/Cover";
import Nfts from "./components/minter/nfts";
import { useBalance, useMinterContract } from "./hooks";
import "./App.css";

const App = function AppWrapper() {
  const { address, connect } = useContractKit();
  const [ profile_stat, setProfile ] = useState(false);
  const { getBalance } = useBalance();
  const minterContract = useMinterContract();
  const name = "Anime Cards Marketplace";

  const profile = (stats) => {
    const { status } = stats
    setProfile(status)
  };
  return (
    <>
      <Notification />
      {address ? (
        <>      
        <Navbar profile={profile}/>
        <Container className="nft_marketplace" fluid="md">
          <main>
            { profile_stat ? (
              <Profile />
            ) : (
              <Nfts
              name={name}
              updateBalance={getBalance}
              minterContract={minterContract}
            />
            )}
          </main>
        </Container>
        </>
      ) : (
        <Cover name={name} connect={connect} />
      )}
    </>
  );
};

export default App;

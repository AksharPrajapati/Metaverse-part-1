import logo from "./logo.svg";
import "./App.css";
import { Suspense, useEffect, useState } from "react";
import Web3 from "web3";
import Land from "./abis/Land.json";
import NavBar from "./components/NavBar";
import { Canvas } from "@react-three/fiber";
import { MapControls, OrbitControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import Plane from "./components/Plane";
import Plot from "./components/Plot";
import Building from "./components/Building";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [landContract, setLandContract] = useState();
  const [cost, setCost] = useState();
  const [buildings, setBuidlings] = useState();

  const [landId, setLandId] = useState();
  const [landName, setLandName] = useState();
  const [landOwner, setLandOwner] = useState();
  const [hasOwner, setHasOwner] = useState();

  useEffect(() => {
    loadBlockChainData();
  }, [account]);

  const loadBlockChainData = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      const accounts = await web3.eth.requestAccounts();
      if (accounts.length > 0) {
        console.log(accounts[0]);

        setAccount(accounts[0]);
      }

      const networkId = await web3.eth.net.getId();

      const land = new web3.eth.Contract(
        Land.abi,
        Land.networks[networkId].address
      );
      setLandContract(land);

      console.log(land.methods);
      const costs = await land.methods.cost().call();
      setCost(web3.utils.fromWei(costs.toString(), "ether"));

      const building = await land.methods.getBuildings().call();
      setBuidlings(building);

      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });

      window.ethereum.on("chainChanged", function (chainId) {
        window.location.reload();
      });
    }
  };

  const web3Handler = async () => {
    if (web3) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }
  };

  const buyHandler = async (id) => {
    try {
      await landContract.methods
        .mint(id)
        .send({ from: account, value: "1000000000000000000" });

      const building = await landContract.methods.getBuildings().call();
      setBuidlings(building);

      setLandName(building[id - 1].name);
      setLandOwner(building[id - 1].owner);
      setHasOwner(true);
    } catch (err) {
      alert("Error:", err);
    }
  };

  console.log(buildings);

  return (
    <div>
      <NavBar web3Handler={web3Handler} account={account} />
      <Suspense>
        <Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 1000 }}>
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <Physics>
            {buildings &&
              buildings.map((building, index) => {
                // console.log(building);
                if (
                  building.owner ===
                  "0x0000000000000000000000000000000000000000"
                ) {
                  return (
                    <Plot
                      key={index}
                      position={[building.posX, building.posY, 0.01]}
                      size={[building.sizeX, building.sizeY]}
                      landId={index + 1}
                      landInfo={building}
                      setLandName={setLandName}
                      setLandOwner={setLandOwner}
                      setLandId={setLandId}
                      setHasOwner={setHasOwner}
                    />
                  );
                } else {
                  return (
                    <Building
                      key={index}
                      position={[building.posX, building.posY, 0.01]}
                      size={[building.sizeX, building.sizeY]}
                      landId={index + 1}
                      landInfo={building}
                      setLandName={setLandName}
                      setLandOwner={setLandOwner}
                      setLandId={setLandId}
                      setHasOwner={setHasOwner}
                    />
                  );
                }
              })}
          </Physics>
          <Plane />
          <OrbitControls />
        </Canvas>
      </Suspense>
      {landId && (
        <div className="info">
          <h1 className="flex">{landName}</h1>

          <div className="flex-left">
            <div className="info--id">
              <h2>ID</h2>
              <p>{landId}</p>
            </div>

            <div className="info--owner">
              <h2>Owner</h2>
              <p>{landOwner}</p>
            </div>

            {!hasOwner && (
              <div className="info--owner">
                <h2>Cost</h2>
                <p>{`${cost} ETH`}</p>
              </div>
            )}
          </div>

          {!hasOwner && (
            <button
              onClick={() => buyHandler(landId)}
              className="button info--buy"
            >
              Buy Property
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

const Plot = ({
  position,
  size,
  landInfo,
  setLandName,
  setLandOwner,
  landId,
  setLandId,
  setHasOwner,
}) => {
  const OnPlotClick = () => {
    setLandId(landId);
    setLandName(landInfo.name);

    if (landInfo.owner == "0x0000000000000000000000000000000000000000") {
      setLandOwner("No Owner");
      setHasOwner(false);
    } else {
      setLandOwner(landInfo.owner);
      setHasOwner(true);
    }
  };
  return (
    <mesh position={position} onClick={OnPlotClick}>
      <planeBufferGeometry attach="geometry" args={size} />
      <meshBasicMaterial attach="material" color="green" />
    </mesh>
  );
};

export default Plot;

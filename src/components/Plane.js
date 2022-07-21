const Plane = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[50, 50]} />
      <meshBasicMaterial attach="material" color="black" />
    </mesh>
  );
};

export default Plane;

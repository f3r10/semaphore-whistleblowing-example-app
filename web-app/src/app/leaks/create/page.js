"use client";
// import Layout from '../../layout';
// import Form from '../../components/form';
import { useWriteContract, useReadContract } from "wagmi";
import { Addresses } from "../../../shared/addresses";
import contractFactoryAbi from "../../../lib/abi/WhistleblowingFactoryContract.json";
import Link from "next/link";

export default function CreateWhistleblowingPage() {
  // const { data: signer } = useSigner();

  const { data: writeData, isPending, writeContractAsync } = useWriteContract();

  const createWhistleblowing = async (event) => {
    event.preventDefault(); // don't redirect the page
    const txHash = await writeContractAsync({
      address: Addresses.FACTORY,
      abi: contractFactoryAbi.abi,
      functionName: "createSemaphoreWhistleblowingProxy",
      args: [],
    });
  };
  return (
    <div>
      <h1 className="">Create</h1>
      <button
        type="button"
        className="mt-5 w-full py-2 bg-gray-600 text-white font-bold rounded transition duration-300 ease-in-out transform hover:scale-105 mb-3"
        onClick={createWhistleblowing}
      >
        Crear oferta
      </button>
      <h2></h2>
      {writeData && (
        <h2 className="text-white"> 🎉 Transaction: {writeData?.hash}</h2>
      )}
    </div>
  );
}

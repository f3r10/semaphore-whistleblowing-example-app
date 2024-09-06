"use client";

import { useReadContract, useWriteContract } from "wagmi";
import { Addresses } from "../../../shared/addresses";
import contractFactoryAbi from "../../../lib/abi/WhistleblowingFactoryContract.json";
import instanceAbi from "../../../lib/abi/SemaphoreWhistleblowing.json";
import { useState, useEffect } from "react";
import { Address } from "viem";
const ethers = require("ethers")
import { config } from "@/lib/config";
import { Contract } from "ethers"
import { readContract, writeContract } from '@wagmi/core';

export default function LeakPage({ params }: { params: { id: string } }) {
        const [addressContract, setAddress] = useState<Address>();
        const id = params.id;
        const { data: address, refetch } = useReadContract({
                address: Addresses.FACTORY,
                abi: contractFactoryAbi.abi,
                functionName: "getSemaphoreWhistleblowingById",
                args: [id],
        });

        let useCreateEntity = async () => {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                writeContract(config, {
                        address: address ,
                        abi: instanceAbi.abi,
                        functionName: "createEntity",
                        args: [signer.address],
                });
        }

        useEffect(() => {
                setAddress(address);
        }, [address]);
        return (
                <div>
                        <div>Leak address: {addressContract}</div>
                        <button onClick={useCreateEntity}>Create entity</button>
                </div>
        );
}

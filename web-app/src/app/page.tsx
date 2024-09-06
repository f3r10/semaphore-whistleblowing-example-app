"use client";
import Image from "next/image";
import { ConnectBtn } from "./components/connectButton";
import Profile from "./components/profile";
import Link from "next/link";
import Card from "./components/card";
import boxOpen from '../../public/box-open.gif';
import { useState, useEffect } from "react";
import { Addresses } from "../shared/addresses";
import contractFactoryAbi from "../lib/abi/WhistleblowingFactoryContract.json";
import { useReadContract } from "wagmi";

export default function Home() {
        const [leaks, setLeaks] = useState([]);
        const { data: allLeaks, refetch } = useReadContract({
                address: Addresses.FACTORY,
                abi: contractFactoryAbi.abi,
                functionName: "getAllSemaphoreWhistleblowing",
                // signerOrProvider: signer.data,
        });

        const LeakList = ({ au = [] }) => {
                return (
                        <div>
                                {" "}
                                {au.map((address, index) => (
                                        <Link key={index} href={`/leaks/${index}`}>
                                                <div key={index} className="m-2">
                                                        <Card
                                                                leakTitle={`Leak #${index}`}
                                                                address={address} imgSrc={undefined} imgAlt={undefined} timeLeft={undefined} tags={undefined} newCard={undefined}              ></Card>
                                                </div>
                                        </Link>
                                ))}{" "}
                        </div>
                );
        };
        useEffect(() => {
                setLeaks(allLeaks);
        }, [allLeaks]);
        return (
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                                <ConnectBtn />
                        </div>
                        <div className="max-w-7xl flex flex-wrap">
                                <Link href="/leaks/create">
                                        <div className="m-2">
                                                <Card
                                                        newCard
                                                        imgSrc={boxOpen}
                                                        imgAlt="Box open" address={undefined} leakTitle={undefined} timeLeft={undefined} tags={undefined} />
                                        </div>
                                </Link>
                                <LeakList au={leaks} />
                        </div>
                        <Profile />
                </main>
        );
}

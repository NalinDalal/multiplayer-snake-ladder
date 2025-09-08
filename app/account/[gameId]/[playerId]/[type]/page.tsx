"use client";
import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from "axios";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from "react-toastify";
import { useUser } from '@clerk/nextjs';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function AccountPage() {
  const { user } = useUser();
  const [amount, setAmount] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const params = useParams();
  const { gameId, playerId, type } = params as { gameId: string, playerId: string, type: string };

  const betAmounts = [0.1, 0.25, 0.5, 1, 2, 3, 4, 5];

  const handleBet = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (!wallet.publicKey) return;
    setIsSpinning(true);
    const snakeWinAccountPublicAddress = process.env.NEXT_PUBLIC_SOLANA_PUBLIC_ADDRESS!;
    const transaction = new Transaction();
    transaction.add(SystemProgram.transfer({
      fromPubkey: wallet.publicKey!,
      toPubkey: new PublicKey(snakeWinAccountPublicAddress),
      lamports: Number(amount) * LAMPORTS_PER_SOL,
    }));
    await wallet.sendTransaction(transaction, connection);
    toast.success(amount + " SOL deposited successfully");
    if(type === 'create') {
      axios.post(`/api/save-game-details`, {
        creator_id: user?.id,
        bet_amount: Number(amount) * LAMPORTS_PER_SOL,
        game_code: gameId,
        player_one_public_key: wallet.publicKey.toBase58(),
        status: "waiting"
      })
      .then((response: { data: { message: string } }) => {
        console.log("Game data saved successfully:", response.data);
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error("Error saving game data:", error.response?.data || error.message);
        } else {
          console.error("Unknown error saving game data:", error);
        }
      });
    } else {
      axios.post(`/api/update-player-two-public-key`, {
        game_code: gameId,
        player_two_public_key: wallet.publicKey.toBase58(),
      })
      .then((response: { data: { message: string } }) => {
        console.log("Game data saved successfully:", response.data);
      }).catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error("Error saving game data:", error.response?.data || error.message);
        } else {
          console.error("Unknown error saving game data:", error);
        }
      });
    }
    router.push(`/game/${gameId}/${playerId}/${type}`);
  };

  useEffect(() => {
    if(type === 'join') {
      const fetchBetAmout = async () => {
        try {
          const response = await axios.get(`/api/get-bet-amount`, {
            params: { gameId },
          });
          setAmount(response.data.bet_amount);
        } catch (error) {
          console.error('Error fetching filtered games:', error);
        }
      };
      fetchBetAmout();
    }
  }, [type, gameId]);

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="betting-card p-4 p-md-5" style={{ maxWidth: '32rem' }}>
        <h1 className="text-center mb-4 fw-bold">Double or Nothing</h1>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-center">
            <WalletMultiButton></WalletMultiButton>
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {betAmounts.map((betAmount) => {
              const isSelected = amount === betAmount.toString();
              return (
                <button
                  key={betAmount}
                  onClick={() => {
                    if (type !== 'join') {
                      setAmount(betAmount.toString());
                    }
                  }}
                  disabled={type === 'join'}
                  className={`btn bet-amount-btn ${isSelected ? 'active' : ''} ${type === 'join' && !isSelected ? 'disabled' : ''}`}
                >
                  {betAmount} SOL
                </button>
              );
            })}
          </div>
          <button
            onClick={handleBet}
            disabled={isSpinning || !amount || parseFloat(amount) <= 0 || !wallet.publicKey}
            className="btn place-bet-btn d-flex align-items-center justify-content-center gap-2 py-3"
          >
            {isSpinning ? (
              <>
                <RefreshCcw className="spinner" size={20} />
                Please Wait...
              </>
            ) : (
              !wallet.publicKey ? 'Connect Wallet to Bet' : 'Play Now'
            )}
          </button>
        </div>
        <p className="text-white-50 small text-center mt-4 mb-0">
          Place your bet and double your money if you win! <br />
          <b>3%</b> fees apply for every game.
        </p>
      </div>
    </div>
  );
}

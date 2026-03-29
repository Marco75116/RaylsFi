import {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const raylsTestnet = defineChain({
  id: 7295799,
  name: "Rayls Testnet",
  nativeCurrency: { name: "USDr", symbol: "USDr", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.rayls.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Rayls Explorer",
      url: "https://testnet-explorer.rayls.com/",
    },
  },
});

const VAULT_ADDRESS = "0x9b25eE0c539c49C4249b38DE137Dc5d280058509" as const;

const vaultAbi = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "userId", type: "string" }],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "userId", type: "string" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

function getAccount() {
  const key = process.env.RAYLS_PRIVATE_KEY;
  if (!key) throw new Error("RAYLS_PRIVATE_KEY is not set");
  return privateKeyToAccount(key as `0x${string}`);
}

const publicClient = createPublicClient({
  chain: raylsTestnet,
  transport: http(),
});

export async function depositToVault(userId: string, amountInCents: number) {
  const account = getAccount();
  const walletClient = createWalletClient({
    account,
    chain: raylsTestnet,
    transport: http(),
  });

  const scaledAmount = amountInCents / 100_000;
  const value = parseEther(scaledAmount.toString());

  const hash = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "deposit",
    args: [userId],
    value,
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}

export async function withdrawFromVault(userId: string, amountInCents: number) {
  const account = getAccount();
  const walletClient = createWalletClient({
    account,
    chain: raylsTestnet,
    transport: http(),
  });

  const scaledAmount = amountInCents / 100_000;
  const value = parseEther(scaledAmount.toString());

  const hash = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "withdraw",
    args: [userId, value],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}

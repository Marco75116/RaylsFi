import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

type MerchantCategory =
  Stripe.TestHelpers.Issuing.AuthorizationCreateParams.MerchantData["category"];

const PARIS_ADDRESSES = [
  { line1: "1 Rue de Rivoli", postalCode: "75001" },
  { line1: "12 Avenue des Champs-Elysees", postalCode: "75008" },
  { line1: "5 Boulevard Saint-Germain", postalCode: "75005" },
  { line1: "8 Rue de la Paix", postalCode: "75002" },
  { line1: "15 Avenue Montaigne", postalCode: "75008" },
  { line1: "3 Rue du Faubourg Saint-Honore", postalCode: "75008" },
  { line1: "22 Boulevard Haussmann", postalCode: "75009" },
  { line1: "10 Rue de Turbigo", postalCode: "75003" },
  { line1: "7 Place de la Bastille", postalCode: "75004" },
  { line1: "18 Rue Oberkampf", postalCode: "75011" },
  { line1: "6 Avenue de lOpera", postalCode: "75001" },
  { line1: "25 Rue de Belleville", postalCode: "75020" },
  { line1: "14 Rue de Charonne", postalCode: "75011" },
  { line1: "9 Boulevard Voltaire", postalCode: "75011" },
  { line1: "31 Rue du Temple", postalCode: "75004" },
  { line1: "4 Rue de Sevigne", postalCode: "75003" },
  { line1: "20 Avenue de la Republique", postalCode: "75011" },
  { line1: "11 Rue des Francs-Bourgeois", postalCode: "75004" },
  { line1: "16 Rue Mouffetard", postalCode: "75005" },
  { line1: "2 Place des Vosges", postalCode: "75004" },
] as const;

export const FRENCH_MERCHANTS = [
  {
    name: "Carrefour Market",
    city: "Paris",
    category: "grocery_stores_supermarkets",
  },
  { name: "Boulangerie Paul", city: "Paris", category: "bakeries" },
  {
    name: "Monoprix Haussmann",
    city: "Paris",
    category: "grocery_stores_supermarkets",
  },
  {
    name: "Le Petit Cler",
    city: "Paris",
    category: "eating_places_restaurants",
  },
  {
    name: "Pharmacie Lafayette",
    city: "Paris",
    category: "drug_stores_and_pharmacies",
  },
  { name: "FNAC Saint-Lazare", city: "Paris", category: "electronics_stores" },
  {
    name: "Cafe de Flore",
    city: "Paris",
    category: "eating_places_restaurants",
  },
  {
    name: "Decathlon Madeleine",
    city: "Paris",
    category: "sporting_goods_stores",
  },
  {
    name: "Picard Surgelés",
    city: "Paris",
    category: "grocery_stores_supermarkets",
  },
  {
    name: "Le Bouillon Chartier",
    city: "Paris",
    category: "eating_places_restaurants",
  },
  {
    name: "Sephora Champs-Élysées",
    city: "Paris",
    category: "cosmetic_stores",
  },
  {
    name: "Franprix Bastille",
    city: "Paris",
    category: "grocery_stores_supermarkets",
  },
  {
    name: "Biocoop Oberkampf",
    city: "Paris",
    category: "grocery_stores_supermarkets",
  },
  {
    name: "Leroy Merlin",
    city: "Ivry-sur-Seine",
    category: "lumber_building_materials_stores",
  },
  {
    name: "Le Relais de l'Entrecôte",
    city: "Paris",
    category: "eating_places_restaurants",
  },
  {
    name: "Tabac Le Diplomate",
    city: "Paris",
    category: "cigar_stores_and_stands",
  },
  { name: "Darty République", city: "Paris", category: "electronics_stores" },
  { name: "Chez Janou", city: "Paris", category: "eating_places_restaurants" },
  {
    name: "Total Energies Station",
    city: "Paris",
    category: "service_stations",
  },
  {
    name: "Nicolas Vins",
    city: "Paris",
    category: "package_stores_beer_wine_and_liquor",
  },
] as const satisfies ReadonlyArray<{
  name: string;
  city: string;
  category: string;
}>;

export function getRandomMerchant() {
  return FRENCH_MERCHANTS[Math.floor(Math.random() * FRENCH_MERCHANTS.length)];
}

let addressIndex = 0;

function getNextParisAddress() {
  const address = PARIS_ADDRESSES[addressIndex % PARIS_ADDRESSES.length];
  addressIndex++;
  return address;
}

function splitName(fullName: string | null): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) return { firstName: "Unknown", lastName: "User" };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "Unknown";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "User";
  return { firstName, lastName };
}

function generateFrenchPhone(): string {
  const suffix = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return `+336${suffix}`;
}

interface CardholderInput {
  name: string | null;
  email: string;
  phoneNumber?: string;
  billing?: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function createStripeCardholder(input: CardholderInput) {
  const { firstName, lastName } = splitName(input.name);
  const defaultAddress = getNextParisAddress();

  const cardholder = await getStripe().issuing.cardholders.create({
    type: "individual",
    name: `${firstName} ${lastName}`,
    email: input.email,
    phone_number: input.phoneNumber ?? generateFrenchPhone(),
    individual: {
      first_name: firstName,
      last_name: lastName,
    },
    billing: {
      address: {
        line1: input.billing?.line1 ?? defaultAddress.line1,
        city: input.billing?.city ?? "Paris",
        postal_code: input.billing?.postalCode ?? defaultAddress.postalCode,
        country: input.billing?.country ?? "FR",
      },
    },
    preferred_locales: ["fr"],
  });

  console.log(
    `[stripe] Cardholder created: id=${cardholder.id}, email=${cardholder.email}`,
  );

  return cardholder;
}

interface CardInput {
  cardholderId: string;
  currency?: string;
  type?: "virtual" | "physical";
  status?: "active" | "inactive";
}

export async function listStripeCards(cardholderId: string) {
  const cards = await getStripe().issuing.cards.list({
    cardholder: cardholderId,
  });

  return cards.data;
}

export async function retrieveStripeCardDetails(cardId: string) {
  const card = await getStripe().issuing.cards.retrieve(cardId, {
    expand: ["number", "cvc"],
  });

  return {
    id: card.id,
    number: card.number ?? null,
    cvc: card.cvc ?? null,
    last4: card.last4,
    expMonth: card.exp_month,
    expYear: card.exp_year,
    brand: card.brand,
  };
}

interface SimulatePaymentInput {
  cardId: string;
  amount: number;
  merchantName: string;
  merchantCity?: string;
  merchantCountry?: string;
  currency?: string;
}

export async function fundTestIssuingBalance(amount: number, currency = "eur") {
  const stripe = getStripe();
  await (
    stripe as unknown as {
      rawRequest: (
        method: string,
        path: string,
        params: Record<string, unknown>,
      ) => Promise<unknown>;
    }
  ).rawRequest("POST", "/v1/test_helpers/issuing/fund_balance", {
    amount,
    currency,
  });
}

export async function simulateStripePayment(input: SimulatePaymentInput) {
  const stripe = getStripe();
  const currency = input.currency ?? "eur";

  const knownMerchant = FRENCH_MERCHANTS.find(
    (m) => m.name === input.merchantName,
  );

  const authorization = await stripe.testHelpers.issuing.authorizations.create({
    card: input.cardId,
    amount: input.amount,
    currency,
    merchant_data: {
      name: input.merchantName,
      city: input.merchantCity ?? knownMerchant?.city ?? "Paris",
      country: input.merchantCountry ?? "FR",
      category:
        (knownMerchant?.category as MerchantCategory) ??
        "miscellaneous_general_merchandise",
    },
  });

  if (authorization.status === "closed") {
    return {
      id: authorization.id,
      amount: authorization.amount,
      currency: authorization.currency,
      merchantName: authorization.merchant_data.name ?? input.merchantName,
      status: authorization.status,
    };
  }

  if (authorization.status !== "pending") {
    throw new Error(
      `Authorization was ${authorization.status}. Check card status and spending limits.`,
    );
  }

  const captured = await stripe.testHelpers.issuing.authorizations.capture(
    authorization.id,
  );

  return {
    id: captured.id,
    amount: captured.amount,
    currency: captured.currency,
    merchantName: captured.merchant_data.name ?? input.merchantName,
    status: captured.status,
  };
}

export async function createStripeCard(input: CardInput) {
  const card = await getStripe().issuing.cards.create({
    cardholder: input.cardholderId,
    currency: input.currency ?? "eur",
    type: input.type ?? "virtual",
    status: input.status ?? "active",
  });

  console.log(
    `[stripe] Card created: id=${card.id}, cardholder=${card.cardholder.id}`,
  );

  return card;
}

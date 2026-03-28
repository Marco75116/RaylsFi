import { getStripe } from "@/lib/stripe";

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

import { useContract } from "./useContract";
import AnimeCardAbi from "../contracts/AnimeCard.json";
import AnimeCardContractAddress from "../contracts/AnimeCard-address.json";

export const useMinterContract = () =>
  useContract(AnimeCardAbi.abi, AnimeCardContractAddress.AnimeCard);
  
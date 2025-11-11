import axios from "axios";

const API_URL = "http://localhost:3000/coches";

export async function getCoches() {
  const res = await axios.get(API_URL);
  return res.data;
}

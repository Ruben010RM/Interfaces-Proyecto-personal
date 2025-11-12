import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import GestionClientes from "../components/GestionClientes.vue";
import NotiCias from "../components/NotiCias.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import CoChes from "../components/CoChes.vue";
import EmpLeados from "../components/EmpLeados.vue";
import ModeLos from "../components/ModeLos.vue";
import ModelosPractica from "../components/ModelosPractica.vue";
import VenTas from "../components/VenTas.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: PaginaInicio,
  },
  {
    path: "/clientes",
    name: "GestionClientes",
    component: GestionClientes,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/noticias",
    name: "NotiCias",
    component: NotiCias,
  },
  {
    path: "/avisolegal",
    name: "AvisoLegal",
    component: AvisoLegal,
  },
  {
    path: "/politicaprivacidad",
    name: "PoliticaPrivacidad",
    component: PoliticaPrivacidad,
  },
  {
    path: "/coches",
    name: "CoChes",
    component: CoChes,
  },
  {
    path: "/empleados",
    name: "EmpLeados",
    component: EmpLeados,
  },
  {
    path: "/modelos",
    name: "ModeLos",
    component: ModeLos,
  },
  {
    path: "/modelosPractica",
    name: "ModelosPractica",
    component: ModelosPractica,
  },
  {
    path: "/ventas",
    name: "VenTas",
    component: VenTas,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

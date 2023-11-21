// @ts-ignore
import { createRouter, createWebHistory } from "vue-router";
import ChatForm from "@/views/ChatFormView.vue";
import ChatsView from "@/views/ChatsView.vue";
import StationForm from "@/views/StationsFormView.vue";
import StationsView from "@/views/StationsView.vue";
import UsersFormAdmin from "@/views/UsersFormAdminView.vue";
import UsersFormSmView from "@/views/UsersFormStationMangerView.vue";
import UsersAdminView from "@/views/UsersAdminView.vue";
import UsersSmView from "@/views/UsersStationMangerView.vue";
import VolunteersView from "@/views/VolunteersView.vue";
import VolunteerForm from "@/views/VolunteersFormView.vue";
import FlagbagsView from "@/views/FlagbagsView.vue";
import FlagbagForm from "@/views/FlagbagsFormView.vue";
import loginView from "@/views/LoginView.vue";
import StationsFormView from "@/views/StationsFormView.vue";
import ScanView from "@/views/ScanView.vue";
import RegView from "@/views/RegView.vue";

const routes = [
  // Home
  {
    path: "/",
    name: "Home",
    redirect: "/login",
  },
  // Login
  {
    path: "/login",
    name: "login",
    component: loginView,
  },
  //Scan QR code page
  {
    path: "/scan",
    name: "Scan QR code",
    component: ScanView,
  },
  // Users
  {
    path: "/admin",
    children: [
      {
        path: "",
        component: UsersAdminView,
      },
      {
        path: "create",
        name: "user creation",
        component: UsersFormAdmin,
      },
      {
        path: ":uid",
        name: "user creation",
        component: UsersFormAdmin,
      },
    ],
  },
  {
    path: "/student",
    children: [
      {
        path: "",
        component: UsersSmView,
      },
      {
        path: ":uid",
        name: "User Details",
        component: UsersFormSmView,
      },
    ],
  },

  {
    path: "/reg",
    children: [
      {
        path: "",
        component: RegView,
      },
    ],
  },

  // Events
  {
    path: "/chat",
    children: [
      {
        path: "",
        component: ChatsView,
      },
      {
        path: "create",
        name: "Chat Creation",
        component: ChatForm,
      },
      {
        path: ":uid",
        name: "Chat Details",
        component: ChatForm,
      },
    ],
  },
  // Stations
  {
    path: "/events/:eid/stations",
    children: [
      {
        path: "",
        component: StationsView,
      },
      {
        path: "create",
        component: StationsFormView,
      },
      {
        path: ":sid",
        name: "Station Details",
        component: StationForm,
      },
      {
        path: "update",
        name: "Station Update",
        component: ChatForm,
      },
    ],
  },
  // Volunteers
  {
    path: "/events/:eid/stations/:sid/volunteers",
    children: [
      {
        path: "",
        component: VolunteersView,
      },
      {
        path: "create",
        component: VolunteerForm,
      },
      {
        path: ":vid",
        component: VolunteerForm,
      },
    ],
  },
  //flagbag
  {
    path: "/events/:eid/stations/:sid/volunteers/:vid/flagbags",
    children: [
      {
        path: "",
        component: FlagbagsView,
      },
      {
        path: "create",
        component: FlagbagForm,
      },
      {
        path: ":fid",
        component: FlagbagForm,
      },
    ],
  },
];
const router = createRouter({
  // eslint-disable-next-line no-undef
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

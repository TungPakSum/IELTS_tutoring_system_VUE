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
import HomeView from "@/views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SpeakingView from "@/views/SpeakingView.vue";
import ModReadingView from "@/views/ModReadingView.vue";
import ModReadingCardView from "@/views/ModReadingCardView.vue";

const routes = [
  // Home
  {
    path: "/",
    name: "Home",
    redirect: "/home",
  },
  // Login
  {
    path: "/login",
    name: "login",
    component: loginView,
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

  // writing
  {
    path: "/writing",
    children: [
      {
        path: "",
        component: ChatsView,
      },
    ],
  },

  // speaking
  {
    path: "/speaking",
    children: [
      {
        path: "",
        component: SpeakingView,
      },
    ],
  },

  // ModReading
  {
    path: "/modreading",
    children: [
      {
        path: "",
        component: ModReadingCardView,
      },
      {
        path: "create",
        name: "passage creation",
        component: ModReadingView,
      },
      {
        path: ":pid",
        name: "passage modify",
        component: ModReadingView,
      },
    ],
  },

  //profile
  {
    path: "/profile",
    children: [
      {
        path: "",
        component: ProfileView,
      },
    ],
  },

  //home
  {
    path: "/home",
    children: [
      {
        path: "",
        component: HomeView,
      }
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

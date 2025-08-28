import { createRouter, createWebHistory } from "vue-router";
// 导入 Login 组件
import Login from "@/views/Login.vue";
import Index from "@/views/index.vue";

import HomeComponent from "@/components/HomeComponent.vue";
import CollectComponent from "@/components/CollectComponent.vue";

import Picture from "@/components/HomeComponents/Picture.vue";
import Document from "@/components/HomeComponents/Document.vue";
import AllFile from "@/components/HomeComponents/AllFile.vue";
import Music from "@/components/HomeComponents/Music.vue";
import Video from "@/components/HomeComponents/Video.vue";
import Other from "@/components/HomeComponents/Other.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [
    {
      path: "/Login",
      name: "Login",
      component: Login,
    },
    {
      path: "/Index",
      name: "Index",
      component: Index,
      children: [
        {
          path: "/Home",
          name: "Home",
          component: HomeComponent,
          children: [
            {
              path: "/Home/Picture",
              name: "Picture",
              component: Picture,
            },
            {
              path: "/Home/Document",
              name: "Document",
              component: Document,
            },
            {
              path: "/Home/AllFile",
              name: "AllFile",
              component: AllFile,
            },
            {
              path: "/Home/Music",
              name: "Music",
              component: Music,
            },
            {
              path: "/Home/Video",
              name: "Video",
              component: Video,
            },
            {
              path: "/Home/Other",
              name: "Other",
              component: Other,
            },
          ],
        },
        {
          path: "/Collect",
          name: "Collect",
          component: CollectComponent,
        },
      ],
    },
  ],
});

export default router;

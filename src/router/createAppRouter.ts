import { createRouter, createWebHistory } from 'vue-router'
import { AppView } from '@/router/AppView'
import { restoreScrollPosition } from '@/router/restoreScrollPosition'
import OverviewView from '@/views/OverviewView.vue'
import PreviewView from '@/views/PreviewView.vue'
import PrintView from '@/views/PrintView.vue'

export const createAppRouter = () =>
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { path: '/', name: AppView.Preview, component: PreviewView },
      { path: '/overview', name: AppView.Overview, component: OverviewView },
      { path: '/print', name: AppView.Print, component: PrintView },
    ],
    scrollBehavior: restoreScrollPosition,
  })

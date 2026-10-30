import { createRouter, createWebHistory } from 'vue-router'
import { AppView } from '@/router/AppView'
import PreviewView from '@/views/PreviewView.vue'
import PrintView from '@/views/PrintView.vue'

export const createAppRouter = () =>
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { path: '/', name: AppView.Preview, component: PreviewView },
      { path: '/print', name: AppView.Print, component: PrintView },
    ],
  })

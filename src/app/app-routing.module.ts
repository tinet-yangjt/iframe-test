import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmotionComponent } from './emotion/emotion.component';
import { IndexComponent } from './index/index.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        component: IndexComponent,
    },
    {
        path: 'test',
        component: TestComponent,
    },
    {
        path: 'emotion',
        component: EmotionComponent,
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

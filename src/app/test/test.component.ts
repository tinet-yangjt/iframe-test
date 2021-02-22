import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../core/websocket.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less']
})
export class TestComponent implements OnInit, OnDestroy {
    wsurl = 'ws://poc1.emotibot.com:8339/ws/assistant/';
    enterpriseId = 'd9f51010dbf646ecb66b60b58b55f64b';
    msgWS: any; // message websocket
    msgData: any = {
        customerMessage: []
    }; // 客户属性内容
    custAttrData: any;
    asrCount = 0;

    constructor(
        private wsService: WebsocketService,
    ) { }

    ngOnInit(): void {
        this.wsurl = `wss://emotibot-gac-test.gacne.com.cn:443/ws/assistant/`;
        this.enterpriseId = '2';
        this.getCustAttrContent();
    }

    getCustAttrContent(index: number = 0) {
        const msgUrl = `${ this.wsurl }vioce/customer/message?ID=7788&first=true&enterpriseId=1&phone=18815615442&index=0&dealerId=GDA0100&callType=2`;
        this.msgWS = this.wsService.createObservableSocket(msgUrl).subscribe(
            data => {
                this.msgData = JSON.parse(data);
                this.custAttrData = this.msgData.customerMessage;
                console.log(this.custAttrData, 2222222222);
            },
            error => {
                //  console.log(error)
                this.asrCount >= 3 ? console.log('三次重连失败') : this.wsRetry(this.getCustAttrContent);
            },
            () => console.log('流已结束')
        );
    }

    // tslint:disable-next-line:ban-types
    wsRetry(func: Function) {
        setTimeout(() => {
            func(1);
            this.asrCount++;
        }, 3000);
    }

    ngOnDestroy() {
        if (this.msgWS) {
            this.msgWS.unsubscribe();
        }
        this.asrCount = 0;
    }
}

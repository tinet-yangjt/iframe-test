import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/core/websocket.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit, OnDestroy {
    wsurl = 'ws://poc1.emotibot.com:8339/ws/assistant/';
    enterpriseId = 'd9f51010dbf646ecb66b60b58b55f64b';
    msgWS: any; // message websocket
    msgData: any; // 客户属性内容
    custAttrData: any;
    asrCount = 0;
    asrWS: any; // asr websocket
    asrData: any = {
        textMessage: {}
    };

    constructor(
        private wsService: WebsocketService,
    ) {
        // 子页面接收到父页面发送的消息
        // tslint:disable-next-line:only-arrow-functions
        window.addEventListener('message', function(event){
            console.log(event, 111111);
            const data = typeof event.data;
            if (data === 'string') {
                document.getElementById('message').innerHTML = event.data
            }
        }, false);
    }

    ngOnInit(): void {
        this.wsurl = `wss://emotibot-gac-test.gacne.com.cn:443/ws/assistant/`;
        this.enterpriseId = '2';
        this.initAsrWs();
        this.getCustAttrContent();
    }

    initAsrWs(index: number = 0) {
        const asrUrl = `${ this.wsurl }vioce/asr?ID=7788&first=true&enterpriseId=1&phone=18815615442&index=0&dealerId=GDA0100&callType=2`;
        this.asrWS = this.wsService.createObservableSocket(asrUrl).subscribe(
            data => {
                if (data.indexOf('memento') > 0) {
                    this.asrData = JSON.parse(data);
                    // console.log(this.asrData, 111111111111);
                    console.log(this.asrData.textMessage.text)
                    // this.initChatMsg(this.asrData);
                    // this.initUserShow(this.asrData, 'asr');
                }
            },
            error => {
                //   console.log(error)
                this.asrCount >= 3 ? console.log('三次重连失败') : this.wsRetry(this.initAsrWs);
            },
            () => console.log('流已结束')
        );
    }

    getCustAttrContent(index: number = 0) {
        const msgUrl = `${ this.wsurl }vioce/customer/message?ID=7788&first=true&enterpriseId=1&phone=18852865307&index=0&dealerId=GDA0100&callType=2`;
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

    buttonClick() {
        const input: any = document.getElementById('input');
        const value = input.value;
        top.postMessage(value, 'https://tinet-yangjt.github.io/test/')
    }

    ngOnDestroy() {
        if (this.msgWS) {
            this.msgWS.unsubscribe();
        }
        if (this.asrWS) {
            this.asrWS.unsubscribe();
        }
        this.asrCount = 0;
    }

}

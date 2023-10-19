import requests
import time
cvecha=[];
count=5;
avg_cvecha=[0,0];
def get_time():
    req=requests.get('https://api.binance.com/api/v3/time');
    return req.json()['serverTime']/1000;
def get_price():
    req=requests.get('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
    return float(req.json()['lastPrice']);
def check(count,local_max,local_min,rev):
    check_cv=True;
    local_avg=0;
    if(len(cvecha)>count):
        for i in range(1,count+1):
            if(rev==True and cvecha[-1-i]['open']>cvecha[-1-i]['close'] and cvecha[-1-i]['open']>local_max):
                check_cv=False;
            if(rev==True and cvecha[-1-i]['open']<cvecha[-1-i]['close'] and cvecha[-1-i]['close']>local_max):
                check_cv=False;
            if(rev==False and cvecha[-1-i]['open']>cvecha[-1-i]['close'] and cvecha[-1-i]['close']<local_min):
                check_cv=False;
            if(rev==False and cvecha[-1-i]['open']<cvecha[-1-i]['close'] and cvecha[-1-i]['open']<local_min):
                check_cv=False;
            local_avg+=abs(cvecha[-1-i]['open']-cvecha[-1-i]['close']);
        if(local_avg/count<avg_cvecha[1] and otchet[0]==0):
            if(rev==True):
                check_cv=False;
            if(rev==False):
                check_cv=False;
        if(local_avg/count<avg_cvecha[1] and otchet[0]==count):
            if(rev==True):
                hai[1]=0;
            if(rev==False):
                loi[1]=0;
        return check_cv;
    else:
        return None;
time_s=[time.localtime(get_time()).tm_min,0];
time_s[1]=time_s[0];
otchet=[0,0];
hai=[[],0];
loi=[[],0];
while True:
    price=get_price();
    time_s[0]=time.localtime(get_time()).tm_min;
    local_max=0;
    local_min=0;
    if(time_s[0]!=time_s[1]):
        if(len(cvecha)>0):
            cvecha[-1]['close']=price;
            if(cvecha[-1]['open']>cvecha[-1]['close']):
                local_max=cvecha[-1]['open'];
                local_min=cvecha[-1]['close'];
            elif(cvecha[-1]['open']<cvecha[-1]['close']):
                local_max=cvecha[-1]['close'];
                local_min=cvecha[-1]['open'];
            if(check(5,local_max,local_min,True)==True):
                hai[1]=local_max;
                otchet[0]=0;
            elif(hai[1]>local_max and hai[1]!=0 and check(5,local_max,local_min,True)==False):
                otchet[0]+=1;
            if(check(5,local_max,local_min,False)==True):
                loi[1]=local_min;
                otchet[1]=0;
            elif(loi[1]<local_min and loi[1]!=0 and check(5,local_max,local_min,False)==False):
                otchet[1]+=1;
            if(otchet[0]==count):
                hai[0].append(hai[1]);
                otchet[0]=0;
                hai[1]=0;
                print(hai[0]);
            if(otchet[1]==count):
                loi[0].append(loi[1]);
                otchet[1]=0;
                loi[1]=0;
                print(loi[0]);
            if(len(hai[0])>1 and len(loi[0])>1):
                higher=[None,None];
                if(hai[0][-2]-avg_cvecha[1]>hai[0][-1]):
                    higher[0]=False;
                if(loi[0][-2]-avg_cvecha[1]>loi[0][-1]):
                    higher[1]=False;
                if(hai[0][-2]+avg_cvecha[1]<hai[0][-1]):
                    higher[0]=True;
                if(loi[0][-2]+avg_cvecha[1]<loi[0][-1]):
                    higher[1]=True;
                if(higher[0]==True and higher[1]==True):
                    print("Тренд вверх");
                if(higher[0]==False and higher[1]==False):
                    print("Тренд вниз");
                if(higher[0]==False and higher[1]==True):
                    print("Суживающийся треугольник");
                if(higher[0]==True and higher[1]==False):
                    print("Расширяющийся треугольник");
                if(higher[0]==None):
                    print("Двойная вершина");
                if(higher[1]==None):
                    print("Двойное дно");
            print(otchet,hai[1],loi[1],avg_cvecha[1]);
            avg_cvecha[0]+=local_max-local_min;
            avg_cvecha[1]=avg_cvecha[0]/len(cvecha);
            cvecha.append({'min':price,'max':price,'open':price,'close':price});
        else:
            cvecha.append({'min':price,'max':price,'open':price,'close':price});
        time_s[1]=time_s[0];
    else:
        if(len(cvecha)>0):
            if(price<cvecha[-1]['min']):
                cvecha[-1]['min']=price;
            elif(price>cvecha[-1]['max']):
                cvecha[-1]['max']=price;
    time.sleep(0.5);

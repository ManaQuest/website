import requests
import time
cvecha=[];
count=5;
avg_cvecha=[0,0];
education=True;
def get_time():
    req=requests.get('https://api.binance.com/api/v3/time');
    return req.json()['serverTime']/1000;
def get_price():
    req=requests.get('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
    return float(req.json()['lastPrice']);
def get_history():
    req=requests.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m');
    return req.json();
"""
def check(count,local_max,local_min,rev,otchet):
    check_cv=True;
    local_avg=0;
    if(len(cvecha)>count):
        if(otchet!=count-1):
            for i in range(1,count+1):
                if(rev==True and max(cvecha[-1-i]['open'],cvecha[-1-i]['close'])>=local_max):
                    check_cv=False;
                if(rev==False and min(cvecha[-1-i]['open'],cvecha[-1-i]['close'])<=local_min):
                    check_cv=False;
            if(rev==True and check_cv==True):
                hai[1]=local_max;
                otchet=0;
            if(rev==False and check_cv==True):
                loi[1]=local_min;
                otchet=0;
            if(rev==True and i==count):
                local_avg=hai[1]-min(cvecha[-1-count]['open'],cvecha[-1-count]['close']);
            if(rev==False and i==count):
                local_avg=max(cvecha[-1-count]['open'],cvecha[-1-count]['close'])-loi[1];
        else:
            for i in range(count):
                if(rev==True and max(cvecha[-1-i]['open'],cvecha[-1-i]['close'])>=local_max):
                    check_cv=False;
                if(rev==False and min(cvecha[-1-i]['open'],cvecha[-1-i]['close'])<=local_min):
                    check_cv=False;
            if(rev==True and check_cv==True):
                hai[1]=local_max;
                otchet=0;
            if(rev==False and check_cv==True):
                loi[1]=local_min;
                otchet=0;
            if(rev==True):
                local_avg=hai[1]-min(cvecha[-1]['open'],cvecha[-1]['close']);
            if(rev==False):
                local_avg=max(cvecha[-1]['open'],cvecha[-1]['close'])-loi[1];
        local_avg=abs(local_avg);
        if(local_avg<avg_cvecha[1] and check_cv==True):
            print(local_avg,cvecha[-1]);
            check_cv=None;
        if(local_avg<avg_cvecha[1] and check_cv==False):
            print(local_avg,cvecha[-1],"aaaa");
            if(rev==True and otchet==count-1):
                hai[1]=0;
            if(rev==False and otchet==count-1):
                loi[1]=0;
        return check_cv;
    else:
        return None;
"""
educ_arr=get_history();
index=0;
time_s=[time.localtime(get_time()).tm_min,0];
time_s[1]=time_s[0];
otchet=[0,0];
hai=[[],0];
loi=[[],0];
def check(count,rev):
    start=1;
    if(rev==True):
        if(otchet[0]==count-1):
            start=0;
    else:
        if(otchet[1]==count-1):
            start=0;
    if(len(cvecha)>count):
        check_cv=True;
        local_avg=0;
        for i in range(start,count+start):
            if(rev==True and max(cvecha[-1-i]['open'],cvecha[-1-i]['close'])>local_max):
                check_cv=False;
            if(rev==False and min(cvecha[-1-i]['open'],cvecha[-1-i]['close'])<local_min):
                check_cv=False;
        if(check_cv==True):
            if(rev==True):
                hai[1]=local_max;
            if(rev==False):
                loi[1]=local_min;
        if(start==1):
            if(rev==True):
                local_avg=hai[1]-min(cvecha[-1-count]['open'],cvecha[-1-count]['close']);
            if(rev==False):
                local_avg=max(cvecha[-1-count]['open'],cvecha[-1-count]['close'])-loi[1];
        else:
            if(rev==True):
                local_avg=hai[1]-min(cvecha[-1]['open'],cvecha[-1]['close']);
            if(rev==False):
                local_avg=max(cvecha[-1]['open'],cvecha[-1]['close'])-loi[1];
        local_avg=abs(local_avg);
        if(local_avg<avg_cvecha[1] and (check_cv==True or (check_cv==False and otchet==count-1))):
            check_cv=None;
        return check_cv;
    else:
        return None;
while True:
    if(education==False):
        price=get_price();
        time_s[0]=time.localtime(get_time()).tm_min;
    local_max=0;
    local_min=0;
    if(time_s[0]!=time_s[1] or (education==True and index<len(educ_arr))):
        if(len(cvecha)>0):
            if(education==False):
                cvecha[-1]['close']=price;
            local_max=max(cvecha[-1]['open'],cvecha[-1]['close']);
            local_min=min(cvecha[-1]['open'],cvecha[-1]['close']);
            if(check(count,True)==True):
                hai[1]=local_max;
                otchet[0]=0;
            elif(check(count,True)==False and hai[1]>local_max and hai[1]!=0):
                otchet[0]+=1;
            else:
                hai[1]=0;
                otchet[0]=0;
            if(check(count,False)==True):
                loi[1]=local_min;
                otchet[1]=0;
            elif(check(count,False)==False and loi[1]<local_min and loi[1]!=0):
                otchet[1]+=1;
            else:
                loi[1]=0;
                otchet[1]=0;
            if(otchet[0]==count):
                hai[0].append([hai[1],len(cvecha)]);
                otchet[0]=0;
                hai[1]=0;
                print(hai[0]);
            if(otchet[1]==count):
                loi[0].append([loi[1],len(cvecha)]);
                otchet[1]=0;
                loi[1]=0;
                print(loi[0]);
            if(len(hai[0])>1 and len(loi[0])>1):
                higher=[None,None];
                if(hai[0][-2][0]-avg_cvecha[1]>hai[0][-1][0]):
                    higher[0]=False;
                if(loi[0][-2][0]-avg_cvecha[1]>loi[0][-1][0]):
                    higher[1]=False;
                if(hai[0][-2][0]+avg_cvecha[1]<hai[0][-1][0]):
                    higher[0]=True;
                if(loi[0][-2][0]+avg_cvecha[1]<loi[0][-1][0]):
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
            avg_cvecha[0]+=local_max-local_min;
            avg_cvecha[1]=(avg_cvecha[0]*1)/len(cvecha);
            if(education==False):
                print(otchet,hai[1],loi[1],round(avg_cvecha[1],2),time_s[0]);
            else:
                print(otchet,hai[1],loi[1],round(avg_cvecha[1],2),time.localtime(int(educ_arr[index][0])/1000).tm_min,time.localtime(int(educ_arr[index][0])/1000).tm_hour);
            if(education==True):
                cvecha.append({'min':float(educ_arr[index][3]),'max':float(educ_arr[index][2]),'open':float(educ_arr[index][1]),'close':float(educ_arr[index][4])});
                index+=1;
            if(education==False):
                cvecha.append({'min':price,'max':price,'open':price,'close':price});
        elif(education==False):
            cvecha.append({'min':price,'max':price,'open':price,'close':price});
        elif(education==True):
            cvecha.append({'min':float(educ_arr[index][3]),'max':float(educ_arr[index][2]),'open':float(educ_arr[index][1]),'close':float(educ_arr[index][4])});
            index+=1;
        time_s[1]=time_s[0];
    elif(index==len(educ_arr)):
        education=False;
    elif(education==False):
        if(len(cvecha)>0):
            if(price<cvecha[-1]['min']):
                cvecha[-1]['min']=price;
            elif(price>cvecha[-1]['max']):
                cvecha[-1]['max']=price;
    if(education==False):
        time.sleep(0.5);

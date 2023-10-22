import json
file=open("a.json");
json_f={'count':0,'solve':0};
#with open('a.json') as file:
    #json_f = json.load(file);
if list(json_f.keys()).count("solve")==0:
    json_f["solve"]=0;
arr=[[50,50,50],
     [50,50,50],
     [50,50,50]];
#if list(json_f.keys()).count("count")==1:
    #arr=json_f["count"];
predel=100;
count=0;
summ=[0,0,0,0,0,0,0,0];
while True:
    for i in range(3):
        for j in range(3):
            summ[i]+=pow(arr[i][j],2);
            summ[i+3]+=pow(arr[j][i],2);
        summ[6]+=pow(arr[i][i],2);
        summ[7]+=pow(arr[2-i][i],2);
    if(summ.count(summ[0])==8):
        json_f["solve"]+=1;
        json_f[str(json_f["solve"])]=[];
        for j in range(3):
            json_f[str(json_f["solve"])].append(0);
            json_f[str(json_f["solve"])][j]=arr[j].copy();
        #with open('a.json', 'w') as file:
            #json.dump(json_f,file);
        print("Квадрат найден",arr);
    for i in range(8):
        summ[i]=0;
    if(count==9):
        break;
    count=0;
    arr[2][2]+=1;
    pred=False;
    for i in range(2,-1,-1):
        for j in range(2,-1,-1):
            if(arr[i][j]>=predel+1):
                if(not(i==0 and j==0)):
                    arr[i][j]=1;
                if(j>0):
                    arr[i][j-1]+=1;
                elif(j==0 and i>0):
                    arr[i-1][-1]+=1;
                    json_f["count"]=arr.copy();
                    pred=True;
        count+=arr[i].count(predel);
    if(pred==True):
        #with open('a.json', 'w') as file:
            #json.dump(json_f,file);
        print(arr);

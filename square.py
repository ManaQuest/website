arr=[[1,1,1],
     [1,1,1],
     [1,1,1]];
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
        print("Квадрат найден",arr);
    for i in range(8):
        summ[i]=0;
    if(count==9):
        break;
    count=0;
    arr[2][2]+=1;
    for i in range(2,-1,-1):
        for j in range(2,-1,-1):
            if(arr[i][j]>=predel+1):
                if(not(i==0 and j==0)):
                    arr[i][j]=1;
                if(j>0):
                    arr[i][j-1]+=1;
                elif(j==0 and i>0):
                    arr[i-1][-1]+=1;
                    print(arr);
        count+=arr[i].count(3);

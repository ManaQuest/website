import re 
out=[0,10];
count=int(input("Введите количество символов в слове: "));
letters='';
not_letters='';
word=[];
yellow=[];
one='';
f=open("ENRUS.TXT");
for i in range(count):
    word.append('');
for i in range(count):
    yellow.append('');
for i in f:
    if(out[0]<out[1] and re.search(r"[а-яА-Я]",i)==None):
        if(len(i)==count+1):
            print(i);
            out[0]+=1;
    elif(out[0]>=out[1]):
        break;
f.close();
while(input("Ответ найден?\n")!='да'):
    letters+=input("Впишите буквы, которые есть в слове: ");
    yellow_letters=input("Впишите буквы, закрашенные желтым(1-b,2-c): ").replace(" ","").split(",");
    not_letters+=input("Впишите буквы, которых нету в слове: ");
    word_symbol=input("Впишите буквы, порзиции которых известны(1-b,2-c): ").replace(" ","").split(",");
    if(word_symbol!=['']):
        for i in range(len(word_symbol)):
            a=word_symbol[i].split("-");
            word[int(a[0])-1]=a[1];
            yellow[int(a[0])-1]='';
    if(yellow_letters!=['']):
        for i in range(len(yellow_letters)):
            a=yellow_letters[i].split("-");
            yellow[int(a[0])-1]=a[1];
    for i in word:
        if(not_letters.find(i)!=-1):
            one+=i;
    for i in range(count):
        if(not_letters.find(word[i])!=-1):
            not_letters=not_letters.replace(word[i],'');
        if(not_letters.find(yellow[i])!=-1):
            not_letters=not_letters.replace(yellow[i],'');
    f=open("ENRUS.TXT");
    for i in f:
        if(len(i)==count+1 and re.search(r"[а-яА-Я]",i)==None):
            count_let=[0,len(letters)];
            count_not_let=[0,len(not_letters)];
            count_word=[0,0];
            for j in letters:
                if(i.find(j)!=-1 and yellow.count(j)==0):
                    count_let[0]+=1;
                elif(i.find(j)!=-1 and yellow.count(j)>0):
                    y=True;
                    index=0;
                    for s in range(count):
                        if(i.find(j,index)==s and yellow[s]==j):
                            y=False;
                            break;
                        elif(i.find(j,index)==s and yellow[s]!=j):
                            index=i.find(j,index+1);
                    if(y==True):
                        count_let[0]+=1;
            for j in not_letters:
                if(i.find(j)==-1 and one.find(j)==-1):
                    count_not_let[0]+=1;
                elif(i.find(j)!=-1 and one.find(j)!=-1):
                    if(i.count(j)==letters.count(j)):
                        count_not_let[0]+=1;
                elif(i.find(j)!=-1 and yellow.count(j)>0):
                    count_not_let[0]+=1;
            for j in range(count):
                if(word[j]!='' and word[j]==i[j]):
                    count_word[0]+=1;
                if(word[j]==''):
                    count_word[1]+=1;
            if(count_let[0]==count_let[1] and count_not_let[0]==count_not_let[1] and count_word[0]+count_word[1]==count):
                print(i);
    f.close();

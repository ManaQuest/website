status=0;
out=[0,100];
count=int(input("Введите количество символов в слове: "));
letters='';
not_letters='';
word=[];
one=[];
f=open("ENRUS.TXT");
for i in range(count):
    word.append('');
for i in range(count):
    if(not_letters.find(word[i])!=-1):
        not_letters=not_letters.replace(word[i],'');
for i in f:
    if(out[0]<out[1]):
        if(len(i)==count+1):
            print(i);
        out[0]+=1;
    else:
        break;
f.close();
while(input("Ответ найден?\n")!='да'):
    letters+=input("Впишите буквы, которые есть в слове: ");
    not_letters+=input("Впишите буквы, которых нету в слове: ");
    word_symbol=input("Впишите буквы, порзиции которых известны(1-b,2-c): ");
    word_symbol=word_symbol.replace(" ","").split(",");
    if(word_symbol!=['']):
        for i in range(len(word_symbol)):
            a=word_symbol[i].split("-");
            word[int(a[0])-1]=a[1];
    for i in letters:
        if(not_letters.find(i)!=-1):
            one.append(i);
    print(letters.count('a'));
    f=open("ENRUS.TXT");
    for i in f:
        if(len(i)==count+1):
            count_let=[0,len(letters)];
            count_not_let=[0,len(not_letters)];
            count_word=[0,0];
            for j in letters:
                if(i.find(j)!=-1):
                    count_let[0]+=1;
            for j in not_letters:
                if(i.find(j)==-1):
                    count_not_let[0]+=1;
            for j in range(count):
                if(word[j]!='' and word[j]==i[j]):
                    count_word[0]+=1;
                if(word[j]==''):
                    count_word[1]+=1;
            if(count_let[0]==count_let[1] and count_not_let[0]==count_not_let[1] and count_word[0]+count_word[1]==count):
                print(i);
    f.close();

window.onload=function(){
    //调用waterfall函数
    waterfall('main','pin');
  
    var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
    
    window.onscroll=function(){
        if(checkscrollside()){
            // 父级对象
            var oParent = document.getElementById('main');                
            //添加元素节点
            for(var i=0;i<dataInt.data.length;i++){
                //创建 一个class属性为pin的div元素
                var oPin=document.createElement('div');                  
                oPin.className='pin';                                    
                oParent.appendChild(oPin);  
                //创建 一个class属性为box的div元素 
                var oBox=document.createElement('div');
                oBox.className='box';
                oPin.appendChild(oBox);
                //创建img元素
                var oImg=document.createElement('img');
                //有个问题，图像的地址
                oImg.src='./images/'+dataInt.data[i].src;
                oBox.appendChild(oImg);
            }
            waterfall('main','pin');
        };
    }
}


// parend 父级id  pin 元素id

function waterfall(parent,pin){
    // 父级对象
    var oParent=document.getElementById(parent);                    
        oParent.style.position='relative';
    //调用getClassObj函数，获取同类子元素的数组 
    var aPin=getClassObj(oParent,pin);                             
    // 一个块框pin的宽
    var iPinW=aPin[0].offsetWidth;                                 
    //每行中能容纳的pin个数【窗口宽度除以一个块框宽度】 floor 向下取舍
    var num=Math.floor(document.documentElement.clientWidth/iPinW);
    //设置父级居中样式：定宽+自动水平外边距   cssText设置html的多个样式
    oParent.style.cssText='width:'+iPinW*num+'px;margin:0 auto;'; 
    //用于存储 每列中的所有块框相加的高度。
    var pinHArr=[];                                               
    //遍历数组aPin的每个块框元素
    for(var i=0;i<aPin.length;i++){                               
        var pinH=aPin[i].offsetHeight;
        if(i<num){
            //第一行中的num个块框pin 先添加进数组pinHArr
            pinHArr[i]=pinH;                                       
        }else{  
            //数组pinHArr中的最小值minH
            var minH=Math.min.apply(null,pinHArr);
            //调用getminHIndex函数。获取数组pinHArr中的最小高度的索引
            var minHIndex=getminHIndex(pinHArr,minH);
            //设置绝对位移 
            aPin[i].style.position='absolute';
            aPin[i].style.top=minH+'px';
            aPin[i].style.left=aPin[minHIndex].offsetLeft+'px';
            // aPin[i].style.cssText="position:absolute;top:minH+'px';left:aPin[minHIndex].offsetLeft+'px'";              //why
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
            pinHArr[minHIndex]+=aPin[i].offsetHeight;//更新添加了块框后的列高
        }
    }
}

// 通过父级和子元素的class类 获取该同类子元素的数组
    
function getClassObj(parent,className){
    //获取 父级的所有子集
    var obj=parent.getElementsByTagName('*');
    //创建一个数组 用于收集子元素
    var pinS=[];
    //遍历子元素、判断类别、压入数组
    for (var i=0;i<obj.length;i++) {
        if (obj[i].className==className){
            pinS.push(obj[i]);
        }
    };
    return pinS;
}

// 获取 pin高度 最小值的索引index
   
function getminHIndex(arr,minH){
    for(var i in arr){
        if(arr[i]==minH){
            return i;
        }
    }
}


function checkscrollside(){
    var oParent=document.getElementById('main');
    var aPin=getClassObj(oParent,'pin');
    //创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    var documentH=document.documentElement.clientHeight;//页面高度
    return (lastPinH<scrollTop+documentH)?true:false;//到达指定高度后 返回true，触发waterfall()函数
}
<template>
    <div>
        <div v-if="isshow" v-on="{mouseenter:showbtn,mouseleave:hidebtn}">
            <div :class="'tik tik'+lin.tik" @click="tik()"></div>
            <a @click="showlins()">{{lin.title}}<a v-if="lin.ct > 0">{{lin.ct}}</a></a>
            <template v-if="isbtn">
                <a class="fa fa-plus" @click="newl()"></a>
                <a class="fa fa-pencil" @click="edit()"></a>
                <a class="fa fa-times" @click="toggledel()"></a>
                <div class="isdel" v-if="isdel">
                    you sure?
                    <a class="fa fa-check" @click="del()"/>
                </div>
            </template>
            <pre class="cmt" v-if="lin.cmt != ''">{{lin.cmt}}</pre>
        </div>
        <div v-if="showchild">
            <lin v-for="(li) in lin.Child" :lin="li" :key="li.id" />
        </div>
    </div>
</template>
<script>
import req from './../ex/req'
export default {
    name:"lin",
    props:{
        lin:{}
    },
    data:function(){
        return{
            showchild:false,
            isbtn:false,
            isdel:false,
            isshow:true,
        }
    },
    created(){
        this.$bus.on('new'+this.lin.id,this.donew)
        this.$bus.on('edit'+this.lin.id,this.doedit)
        this.$bus.on('del'+this.lin.id,this.dodel)
        this.$bus.on('withtik',this.withtik)
    },
    methods:{
        showlins(){
            if(this.lin.ct > 0 && this.lin.Child == null){
                this.getlins();
            }
            this.showchild = !this.showchild;
        },
        getlins(){
            req.post('list',{id:this.lin.id}).then((res)=>{
                this.lin.Child = res.data
            });
        },
        tik(){
            if(this.lin.tik == 2){
                this.lin.tik = 0
            }else{
                this.lin.tik +=1;
            }
            req.post('tik',{id:this.lin.id,tik:this.lin.tik})
        },
        newl(){
            this.$bus.emit('new',{pid:this.lin.id});
        },
        edit(){
            this.$bus.emit('edit',{lin:this.lin});
        },
        del(){
            req.post('del',{id:this.lin.id}).then((res)=>{
                if(res.data == 'done'){
                    this.$bus.emit('del'+this.lin.pid,this.lin.id);
                }
            });
        },
        donew(da){
            if(this.lin.Child != null)
            this.lin.Child.push(da)
            this.lin.ct += 1
        },
        doedit(da){
            this.lin = da
        },
        dodel(id){
            this.lin.ct -= 1
            var i = this.lin.Child.map((item)=>item.id).indexOf(id)
            this.lin.Child.splice(i,1)
        },
        showbtn(){
            this.isbtn = true
        },
        hidebtn(){
            this.isbtn = false
        },
        toggledel(){
            this.isdel = !this.isdel;
        },
        withtik(tik){
            if(tik == -1){
                this.isshow = true
            }else if(this.lin.tik == tik){
                this.isshow = true
            }else{
                this.isshow = false
            }
        }
    }
}
</script>
<style scoped>
div{
    text-align: left;
    margin-left:10px;
}
a{
    text-align: left;
    margin-left:10px;
}
.cmt{
    margin-left:30px;
    color:#999;
}
.isdel{
    display:inline-block;
}
</style>
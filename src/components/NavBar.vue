<script>
export default {
    name: "NavBar",
    data() {
        return {
            title: "IC Helper"
        }
    },
}
</script>

<template> 
    <div class="nav-bar">
        <h1 id = "title">{{title}}</h1>
    </div>
</template>

<style scoped>
.nav-bar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #71816D;
    height: 50px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.9);
    display: block;
}

#title {
    color: #231E1A;
    text-align: center;
    margin: auto;
    font-size: 2em;
    font-family: 'Spoof Bold', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
</style>
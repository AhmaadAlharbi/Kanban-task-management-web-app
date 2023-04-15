<template>
  <div class="bg-white shadow-xl py-7 w-80 h-screen px-2">
    <div class="">
      <img src="@/assets/images/logo-dark.svg" alt="" />
      <div class="">
        <p class="uppercase text-gray-500 my-5 px-3">all boards (8)</p>
        <nav>
          <ul class="space-y-4 px-3 cursor-pointer">
            <li class="bg-purple-400 py-4 rounded-2xl">Platform Launch</li>
            <li class="">Marketing Plan</li>
            <li class="">Roadmap</li>
            <li class="">+ Create a New Board</li>
          </ul>
        </nav>
      </div>
    </div>
    <div
      class="flex items-center space-x-3 absolute bottom-10 justify-center left-5 bg-gray-200 px-10"
    >
      <div>
        <img src="../assets/images/icon-light-theme.svg" alt="" />
      </div>
      <!-- switch -->
      <div>
        <label class="switch">
          <input type="checkbox" />
          <span class="slider round"></span>
        </label>
      </div>
      <div>
        <div class="">
          <img src="../assets/images/icon-dark-theme.svg" alt="" />
        </div>
      </div>
    </div>
    <p
      class="flex items-center absolute bottom-0 justify-center left-5 cursor-pointer"
    >
      <img src="../assets/images/icon-hide-sidebar.svg" class="mr-3" alt="" />
      Hide sidebar
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
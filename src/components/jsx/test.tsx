// TsxTest.tsx
import { FunctionalComponent as FC, defineComponent, reactive, onMounted } from 'vue';
 
// 无状态组件
const TButton: FC<{ data: number }> = ({ data }) => {
  return (
    <>
      <hr />
      <div>
              <el-button>{ data}</el-button>
      </div>
    </>
  )
};
// 状态组件需要使用 defineComponent
export default defineComponent({
  name: 'TsxTest',
  setup() {
    const data = reactive({ count: 0 });
 
    onMounted(() => {
      data.count = 5;
    });
 
    const clickHandler = () => data.count++
 
    return () => (
      <>
        <span style={{ marginRight: '10px' }}>{ data.count }</span>
        <button onClick={clickHandler}>+</button>
        <TButton data={data.count}/>
      </>
    )
  }
})
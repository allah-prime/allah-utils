import objectUtils from '../index';

export default () => {
  // Test data
  const obj = {
    user: {
      name: 'Trae',
      address: {
        city: 'New York',
        zip: ''
      },
      createdAt: new Date(),
    },
    items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
    status: '',
    role: 'admin'
  };

  // Deep clone
  const cloned = objectUtils.deepClone(obj);
  
  // Merge
  const merged = objectUtils.merge({}, obj, { user: { age: 30 } }) as typeof obj;
  
  // Get/Set/Unset
  const cityName = objectUtils.get(obj, 'user.address.city');
  const tempObj = objectUtils.deepClone(obj);
  objectUtils.set(tempObj, 'user.settings.theme', 'dark');
  objectUtils.unset(tempObj, 'items');

  // Paths
  const paths = objectUtils.paths(obj);

  // BuildNullStr
  const nullStrObj = objectUtils.buildNullStr({ ...obj.user.address, zip: '' }, '-');

  // DeleteTime
  const noTimeObj = objectUtils.deleteTime({ ...obj.user });

  return (
    <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
      <h3>Object Utilities Demo</h3>
      
      <div style={{ marginBottom: 20 }}>
        <h4>Deep Clone</h4>
        <pre style={{ background: '#fff', padding: 10 }}>{JSON.stringify(cloned, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Merge (Add age)</h4>
        <pre style={{ background: '#fff', padding: 10 }}>{JSON.stringify(merged.user, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Path Operations</h4>
        <p>Get 'user.address.city': {cityName}</p>
        <p>Set 'user.settings.theme': {objectUtils.get(tempObj, 'user.settings.theme')}</p>
        <p>Unset 'items': {JSON.stringify(tempObj.items)}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Paths</h4>
        <pre style={{ background: '#fff', padding: 10 }}>{JSON.stringify(paths, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>BuildNullStr (zip -{'>'} '-')</h4>
        <pre style={{ background: '#fff', padding: 10 }}>{JSON.stringify(nullStrObj, null, 2)}</pre>
      </div>

       <div style={{ marginBottom: 20 }}>
        <h4>DeleteTime (remove createdAt)</h4>
        <pre style={{ background: '#fff', padding: 10 }}>{JSON.stringify(noTimeObj, null, 2)}</pre>
      </div>
    </div>
  );
};

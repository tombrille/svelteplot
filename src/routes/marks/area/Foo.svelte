<script lang="ts">
    type FooType = {
        /** foo prop */
        foo: string
    } 

    let { foo } = $props<FooType>()
</script>

<!--
    @component
    The <Foo> component is cool
-->
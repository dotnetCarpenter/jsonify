function scope() {

  function Add(x) { return x + x }

  function Identity(x) { this.Value = x }
  Identity.prototype.unitI = function(a)
    () =>
      Identity(a)
  Identity.prototype.bindI = function(a) {
    return this.unitI(a.Value)
  }
  Identity.prototype.showI =
    a =>
      a.Value

  var i = new Identity()
  console.log(
    new Identity(11 + 10).Value,
    i.showI(
      i.bindI(
        i.unitI(11 + 10)
      )
    )
  )
}
scope()

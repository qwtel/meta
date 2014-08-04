# Meta

Together with a stranger you are arrested and imprisoned. 
Each of you is in solitary confinement with no means of speaking to or exchanging messages with the other. 
However, the police admit they don't have enough evidence to convict you on the charge. 
So they offer each of you a Faustian bargain:
Each of you has the opportunity either to *defect* by testifying, 
or to *cooperate* with the other by remaining silent.
Additionally, you can also *escape* the prison, provoking a bounty and manhunt.

Here's how it goes:

* If both of you *cooperate* you will both go free. (Awarding each of you 2 points)
* If you *defect* while the other *cooperates*, you will go free due to your compliance, while he will go to prison. (Awarding you 4 points, while he loses 1)
* If both of you *defect* you will both go to prison. (Each of you losing 1 point)
* However, if you *escape* while the other *defects*, he will go to prison due to his testimony.
No bounty will be put on you, since the police already have an offender. (Awarding you 4 points, while he loses 1)
* If you both *escape* half of the bounty will be put on each of you. (Each of you getting 0 points)
* Finally, if you *escape* while the other *cooperates*, you will come under strong suspicion, 
leading to a large-scale manhunt, while to other will go free due to lack of evidence. (Awarding him 4 points, while you lose 1).

This basically means that: 

**Defect** *beats* **Cooperate** *beats* **Escape** *beats* **Defect**, 

while **Cooperate/Cooperate** *beats* **Escape/Escape** *beats* **Defect/Defect**.

More formally the table of possible outcomes looks like this:

<table>
  <tbody>
  <tr>
    <td></td>
    <th scope="col">Cooperate</th>
    <th scope="col">Escape</th>
    <th scope="col">Defect</th>
  </tr>
  <tr>
    <th scope="row">Cooperate</th>
    <td>+2/+2</td>
    <td>+4/-1</td>
    <td>-1/+4</td>
  </tr>
  <tr>
    <th scope="row">Escape</th>
    <td>-1/+4</td>
    <td>0/0</td>
    <td>+4/-1</td>
  </tr>
  <tr>
    <th scope="row">Defect</th>
    <td>+4/-1</td>
    <td>-1/+4</td>
    <td>-1/-1</td>
  </tr>
  </tbody>
</table>

